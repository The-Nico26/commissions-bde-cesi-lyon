import base64
import datetime
import logging
import mimetypes
import os
import re
import time
from xml.etree.ElementTree import dump

import markdown
from django.http import Http404, HttpResponseServerError, HttpResponse
from django.shortcuts import render, redirect
from markdown import Extension
from markdown.treeprocessors import Treeprocessor
from raven.transport import requests
from requests.auth import HTTPBasicAuth

REPOSITORY_URL = "https://api.github.com/repos/EpicKiwi/bdecesilyon-documentation/contents/guide{}"
GITHUB_USER = os.getenv("GITHUB_USER")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
CACHE_LIFETIME = 1800

logger = logging.getLogger(__name__)

contentcache = dict()


def show_page(request, path="/"):

    auth = HTTPBasicAuth(GITHUB_USER, GITHUB_TOKEN)

    request_path = path

    if not path.startswith("/"):
        path += "/"

    if path.endswith(".md"):
        return redirect(request.path[:-3])

    content = ""

    if path not in contentcache or time.time() - contentcache[request_path][0] > CACHE_LIFETIME:

        firstR = requests.get(REPOSITORY_URL.format(path), auth=auth)

        check_guide_request_error(firstR, path, only500=True)

        if 400 <= firstR.status_code < 500:
            path += ".md"
            firstRwithext = requests.get(REPOSITORY_URL.format(path), auth=auth)

            check_guide_request_error(firstRwithext, path)
            firstR = firstRwithext

        result = firstR.json()
        is_directory = False

        if type(result) is not dict:
            hasIndex = False
            for file in result:
                if file["name"] == "index.md":
                    hasIndex = True
            if not hasIndex:
                raise Http404("Page du guide \"{}\" non trouvée".format(path))

            path += "index.md"
            indexR = requests.get(REPOSITORY_URL.format(path), auth=auth)
            check_guide_request_error(indexR, path)
            is_directory = True
            result = indexR.json()

        binaryContent = base64.b64decode(result["content"])
        originalPath = result["path"]
        html_url = result["html_url"]
        logger.info("Updated cache for documentation page {}".format(path))
        contentcache[request_path] = (time.time(), binaryContent, result["path"], is_directory, html_url)

    else:
        is_directory = contentcache[request_path][3]
        binaryContent = contentcache[request_path][1]
        originalPath = contentcache[request_path][2]
        html_url = contentcache[request_path][4]

    if not originalPath.endswith(".md"):
        return HttpResponse(binaryContent, content_type=mimetypes.guess_type(originalPath))

    textContent = binaryContent.decode("utf-8")

    title = textContent.splitlines()[0]
    if title.startswith("#"):
        title = re.sub(r'^#+ ?(.+)$', r'\1', title)

    description = re.sub(r'^(.+\.)', r'\1', textContent.splitlines()[2])

    html_content = markdown.markdown(textContent[len(title)+2:], extensions = [
        'extra',
        DocumentationExtention(current_path=request.path, is_directory=is_directory)
    ])

    return render(request, "show_documentation_page.html", {
        "content": textContent,
        "html_content": html_content,
        "title": title,
        "description": description,
        "active_guide": True,
        "html_url": html_url
    })

def check_guide_request_error(request, path, only500=False):
    if not only500 and request.status_code == 404:
        raise Http404("Page du guide \"{}\" non trouvée".format(path))

    elif request.status_code > 200 and not request.status_code == 404:
        logger.error("Error while getting {} page of the guide".format(path))
        logger.error("url: {}; code : {}; content : {}".format(request.url, request.status_code,
                                                               request.text))
        raise ValueError("Error while getting page of guide")
        

class RelativePath(Treeprocessor):

    def __init__(self, md, current_path="/", is_directory=False, **kwargs):
        super().__init__(md, **kwargs)
        self.current_path = current_path.split("/")
        self.is_directory = is_directory

    def run(self, root):
        for child in root:
            if child.tag == "a":
                child.attrib["href"] = self.relative_path(child.attrib["href"])
            if child.tag == "img":
                child.attrib["src"] = self.relative_path(child.attrib["src"])
            self.run(child)

    def relative_path(self, relative):

        if re.compile('^.+?://.*$').match(relative):
            return relative

        splited = relative.split("/")
        if not self.is_directory:
            absolutePath = [*self.current_path[:-1]]
        else:
            absolutePath = [*self.current_path]

        filename = splited[-1]
        splited = splited[:-1]

        if filename.endswith(".md"):
            filename = filename[:-3]

        for element in splited:
            if element == ".":
                continue
            elif element == "..":
                if len(absolutePath) > 0:
                    absolutePath = absolutePath[:-1]
            else:
                absolutePath.append(element)

        if filename == "..":
            if len(absolutePath) > 0:
                absolutePath = absolutePath[:-1]
        elif filename != ".":
            absolutePath.append(filename)

        return "/".join(absolutePath)


class DocumentationExtention(Extension):

    def __init__(self, current_path="/", is_directory=False, **kwargs):
        super().__init__(**kwargs)
        self.current_path = current_path
        self.is_directory = is_directory

    def extendMarkdown(self, md):
        md.treeprocessors.register(RelativePath(md, current_path=self.current_path, is_directory=self.is_directory), 'relativePath', 10)
