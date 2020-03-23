# https://www.crummy.com/software/BeautifulSoup/bs4/doc/
from bs4 import BeautifulSoup
import json
import requests
import re
import xml.etree.ElementTree as ET

from urllib.parse import urlparse
from fuzzywuzzy import process as proc
from datetime import datetime as time
# some libary that has a list of countries


def getCountry(lookup):
    # url =  "https://maps.googleapis.com/maps/api/geocode/json?address={}&key=AIzaSyB4EMW8mIRBZosu2dmcqCje3n_2xo2mrjg".format(lookup)
    # page = (requests.get(url)).json()
    # if page['status'] == "ZERO_RESULTS" or len(page['results'][0]['address_components']) > 3:
    #     return None
    # return page['results'][0]['address_components'][-1]['long_name']
    return 'Australia'


def getDisease(title):
    acc = 80  # set the miniumum required match, probs could be higher
    output = "coronavirus"
    for word in title:
        result = proc.extractOne(word, diseases)
        if result[1] > acc and len(word) in range(len(result[0])-1, len(result[0])+1):
            acc = result[1]
            output = result[0]
    if output in legit_diseases:
        output = legit_diseases[output]
    return output


def getTime(time_str):
    return time.strptime(time_str, '%Y-%m-%dT%H:%M:%S')


def getText(text):
    return text.text.strip()


def getURLS():
    next_page = soup.find(
        'a', class_='js-pagenav-button js-pagenav-next-button b-button b-button--secondary js-shrink-event-child')
    page_total = soup.find('span', class_='pagetotal')
    urls = []
    for i in range(1, int(page_total.text)+1):
        urls.append(str(next_page['href'][:-1]+str(i)))
    return urls


url = "https://flutrackers.com/forum/search?searchJSON=%7B%22last%22%3A%7B%22from%22%3A%222%22%7D%2C%22sort%22%3A%7B%22created%22%3A%22desc%22%7D%2C%22view%22%3A%22topic%22%2C%22starter_only%22%3A1%2C%22exclude_type%22%3A%5B%22vBForum_PrivateMessage%22%5D%2C%22ignore_protected%22%3A1%7D"
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')


urls = getURLS()


diseases = ["unknown", "other", "anthrax cutaneous", "anthrax gastrointestinous", "anthrax inhalation", "botulism", "brucellosis", "chikungunya", "cholera", "coronavirus", "cryptococcosis", "cryptosporidiosis", "crimean-congo haemorrhagic fever", "dengue", "diphteria", "ebola haemorrhagic fever", "ehec (e.coli)", "enterovirus 71 infection", "influenza a/h5n1", "influenza a/h7n9", "influenza a/h9n2", "influenza a/h1n1", "influenza a/h1n2", "influenza a/h3n5", "influenza a/h3n2", "influenza a/h2n2", "hand, foot and mouth disease", "hantavirus", "hepatitis a", "hepatitis b", "hepatitis c",
            "hepatitis d", "hepatitis e", "histoplasmosis", "hiv/aids", "lassa fever", "malaria", "marburg virus disease", "measles", "mers-cov", "mumps", "nipah virus", "norovirus infection", "pertussis", "plague", "pneumococcus pneumonia", "poliomyelitis", "q fever", "rabies", "rift valley fever", "rotavirus infection", "rubella", "salmonellosis", "sars", "shigellosis", "smallpox", "staphylococcal enterotoxin b", "thypoid fever", "tuberculosis", "tularemia", "vaccinia and cowpox", "varicella", "west nile virus", "yellow fever", "yersiniosis", "zika", "legionares", "listeriosis", "monkeypox", "COVID-19"]
legit_diseases = {"coronavirus": "COVID-19"}

# DEBUGGING ONLY REMOVE
seen = {}
####
print(len(urls))
# print(len(posts))
for url in urls:
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find(id='widget_52')
    posts = results.find_all('td', class_='js-cell-topic')

    for post in posts:
        title_soup = post.find('a', class_='topic-title')
        title = title_soup.decode_contents()
        country = getCountry(title)
        if country:
            post_link = title_soup['href']
            domain = (post_link).split("/")[2].split(".")[-2]
            if domain == "flutrackers":
                # If it links to another flutrackers post, most likely need to find url on that post
                try:
                    page_post = requests.get(post_link)
                    soup_post = BeautifulSoup(page_post.content, 'html.parser')
                    result_post = soup_post.find(
                        'div', class_='b-post__hide-when-deleted')  # b-post__contentd
                    title = soup_post.find(
                        'div', class_='b-media__body')  # b-post__contentd
                    # link_post = (soup_post.find('a'))['href']
                    title = (title.h2.text).strip().lower().split(" ")
                    disease = getDisease(title)

                    date = soup_post.find('div', class_='b-post__timestamp')
                    time_str = date.find('time')['datetime']
                    time_obj = getTime(time_str)

                    url = soup_post.find(
                        'div', class_='js-post__content-text restore h-wordwrap')
                    # print(url)
                    url = url.a['href']
                    if "flutrackers" in url:
                        print("NOT RIGHT PROBS", url)
                    text = soup_post.find(
                        'div', class_='js-post__content-text restore h-wordwrap')
                    text = getText(text)
                    print("Country: ", country, "\nDisease: ", disease, "\nTime: ", time_obj.strftime(
                        "%Y-%m-%d %H:%M:%S"), "\nURL: ", url, "\nText: ...", text)
                    # remove all this seen stuff later
                    if disease in seen:
                        seen[disease] += 1
                    else:
                        seen[disease] = 1
                    print(seen)
                except:
                    print("failed to classify")
                    pass

# results = 'Australia'

# class DiseaseEntry:
#     def __init__(self, url, date_of_publication, headline, main_text, reports):
#         self.url = url
#         self.date_of_publication = date_of_publication
#         self.headline = headline
#         self.main_text = main_text
#         self.reports = reports

# class Report:
#     def __init__ (self, diseases, syndromes. event_date. locations):
#         self.diseases = diseases
#         self.syndromes = syndromes
#         self.event_date = event_date
#         self.locations = locations

# For each title that has a country mentioned - open associated link
# Then see if link takes us to an article
# Search article for
