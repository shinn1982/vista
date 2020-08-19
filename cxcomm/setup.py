#!/usr/bin/env python
# -*- coding: utf-8 -*-

import codecs
import os

from cxcomm import __title__
from cxcomm import __version__
from cxcomm import __author__
from cxcomm import __email__

# from distutils.core import setup
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with codecs.open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = '\n' + f.read()

with open('requirements.txt') as f:
    required = f.read().splitlines()

setup(
    name=__title__,
    version=__version__,
    author=__author__,
    author_email=__email__,
    description='Some Common packages',
    long_description=long_description,
    url='',
    packages=find_packages(exclude=('tests',)),
    install_requires=required,
    classifiers=[
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: Implementation :: CPython',
        'Programming Language :: Python :: Implementation :: PyPy']
)
