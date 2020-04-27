from bs4 import BeautifulSoup
from requests import get
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime

url = "https://www.health.nsw.gov.au/Infectious/diseases/Pages/covid-19-lga.aspx?fbclid=IwAR1B-9uKNvIPDLvn9viZy5e80bwLX7g67RHNBLrAlfwihifICsT2anFPwMI"
page = get(url)
soup = BeautifulSoup(page.content, 'html.parser')
table = soup.find('table')
cases = {}

for row in table.find_all('tr'):
    try:
        loc = row.find(class_='moh-rteTableEvenCol-6')
        count = row.find(class_='moh-rteTableOddCol-6')
        loc_str = loc.get_text().strip()
        count_str = count.get_text().strip()
        if loc_str not in cases:
            cases[loc_str] = count_str
        # print(loc_str)
        # print(count_str)
    except:
        pass

cred = firebase_admin.credentials.Certificate(
    './seng3011-859af-firebase-adminsdk-tbsvx-227c77c920.json')
default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

# all_areas = []

# for area, num in cases.items():
#     area_num_dict = { 'name': area, 'count': num }
#     all_areas.append(area_num_dict)

# for area in all_areas:
#     print(area)
today = datetime.now().date().strftime("%Y-%m-%d")

for case in cases.keys():
    # Creating document with date so that prediction graphs can be made
    case_id = str(case) + " (" + today + ")"
    doc = {
        'name': str(case),
        'count': str(cases[case]),
        'date': str(today)
    }
    db.collection(u'nsw_cases').document(case_id).set(doc)
