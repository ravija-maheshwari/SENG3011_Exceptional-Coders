import unittest
from scraper import Scraper 

# Testing the scraper separately from the API
# By making a copy of the scraper and running it 
# on a saved HTML file of a FluTrackers forum page

class TestScraper(unittest.TestCase):
    scraper = Scraper()
    articles = scraper.generateArticles(1)

    offset = 0 # This allows us to check the posts starting from the offset in case new posts are added

    def test_url_1(self):
        self.assertEqual(self.articles[self.offset].url, "https://abc7ny.com/health/129-members-of-nypd-46-members-of-fdny-have-coronavirus/6043797/")

    def test_url_2(self):
        self.assertEqual(self.articles[self.offset + 1].url, "https://www.cbc.ca/news/canada/british-columbia/3-americans-test-positive-for-covid-19-after-b-c-heli-ski-tours-1.5506830")

    def test_url_3(self):
        self.assertEqual(self.articles[self.offset + 2].url, "https://www.gulftoday.ae/news/2020/03/23/pakistani-hero-doctor-who-led-fight-against-coronavirus-dies")

    def test_date_1(self):
        self.assertEqual(self.articles[self.offset].date_of_publication, "2020-03-24 01:22:12")

    def test_date_2(self):
        self.assertEqual(self.articles[self.offset + 1].date_of_publication, "2020-03-23 22:10:30")

    def test_date_3(self):
        self.assertEqual(self.articles[self.offset + 2].date_of_publication, "2020-03-23 18:54:05")

    def test_headline_1(self):
        self.assertEqual(self.articles[self.offset].headline, "129 members of NYPD, 46 members of FDNY have COVID-19")

    def test_headline_2(self):
        self.assertEqual(self.articles[self.offset + 1].headline, "3 Americans test positive for COVID-19 after B.C. heli-ski tours")

    def test_headline_3(self):
        self.assertEqual(self.articles[self.offset + 2].headline, "First doctor in Pakistan dies")

    def test_main_text_1(self):
        self.assertEqual(self.articles[self.offset].main_text, "129 members of NYPD, 46 members of FDNY have COVID-19\n\nUpdated 10 minutes ago\nNEW YORK CITY (WABC) -- There are now 12,000 confirmed cases of coronavirus in New York City, which include those on the frontlines in the NYPD and the FDNY.\n\nFDNY Commissioner Daniel Nigro says 46 members have tested positive for COVID-19.\n\nTwo members are hospitalized, and none are believed to have caught the virus while working, but an investigation continues into how they contracted the virus....https://abc7ny.com/health/129-member...virus/6043797/")

    def test_main_text_2(self):
        self.assertEqual(self.articles[self.offset + 1].main_text, "Source: https://www.cbc.ca/news/canada/briti...ours-1.5506830\n\n3 Americans test positive for COVID-19 after B.C. heli-ski tours\nHeli-skiers had contact with staff and guests and travelled through regional airports\nBetsy Trumpener ╖ CBC News ╖ Posted: Mar 23, 2020 2:42 PM PT | Last Updated: 25 minutes ago\n\nThree American men on ski trips with three different B.C. heli-ski companies have tested positive for COVID-19 in the last week, after returning home to the United States.\n\nThat's according to the owners of the three heli-ski companies, which operate hundreds of kilometres apart ù in the Terrace, Prince George and Revelstoke areas.\n\nAccording to the company owners, the three guests spent several days with staff and more than 45 international guests, before they flew home through airports in Terrace and Prince George. The third man travelled by private jet through the Kelowna airport...")

    def test_main_text_3(self):
        self.assertEqual(self.articles[self.offset + 2].main_text, "Source: https://www.gulftoday.ae/news/2020/0...ronavirus-dies\n\nPakistani 'hero' doctor who led fight against coronavirus dies\n21 minutes ago\nTariq Butt, Correspondent\n\nA young physician, Dr Osama Riaz, has become the first Pakistani doctor who died of coronavirus which he had contracted while physically handling suspected COVID-19 patients returning to Gilgit-Baltistan from overseas and other parts of the country. ..")

    def test_diseases_1(self):
        self.assertEqual(self.articles[self.offset].reports[0].diseases[0], "COVID-19")

    def test_diseases_2(self):
        self.assertEqual(self.articles[self.offset + 1].reports[0].diseases[0], "COVID-19")
    
    def test_diseases_3(self):
        self.assertEqual(self.articles[self.offset + 2].reports[0].diseases[0], "COVID-19")

    def test_syndrome_1(self):
        self.assertEqual(len(self.articles[self.offset].reports[0].syndromes), 0)

    def test_syndrome_2(self):
        self.assertEqual(len(self.articles[self.offset + 1].reports[0].syndromes), 0)

    def test_syndrome_3(self):
        self.assertEqual(len(self.articles[self.offset + 2].reports[0].syndromes), 0)

    def test_country_1(self):
        self.assertEqual(len(self.articles[self.offset].reports[0].location), 'United States')

    def test_country_2(self):
        self.assertEqual(len(self.articles[self.offset + 1].reports[0].location), 'Canada')

    def test_country_3(self):
        self.assertEqual(len(self.articles[self.offset + 2].reports[0].location), 'Pakistan')

    # def test_locations_1(self):

if __name__ == '__main__':
    unittest.main()
