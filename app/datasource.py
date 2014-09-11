from urllib2 import Request, urlopen, URLError
import json
import xml.etree.ElementTree as ET
import threading

class DataSource(object):

	def __init__(self):
		self.data=[{}]#{"url":www.yo.com, "corpus":"somestring", word choices:["",""]}
		#instantiate scraper

	def update_data(self):
		del self.urls[:]
		request = Request('http://cloud.feedly.com/v3/search/feeds?q=iphone&n=10')
		try:
			response = urlopen(request)
			kittens = response.read()
			data = json.loads(kittens)
			i = 0

		except URLError, e:
		    print 'No kittez. Got an error code:', error

		for result in data['results']:
			print i
			url= result['feedId'][5:]
			tree = ET.ElementTree(file=urlopen(url)) 
			root = tree.getroot()

			for item in root.iter('item'):
				curr_url = item.find('link').text
				data_trio = {}
				data_trio['url']=curr_url
				data_trio['corpus']=scrape_url(curr_url)
				data_trio['wordchoice']=choose_words(data_trio['corpus'])
				self.data.append(data_trio);
			i+=1
		print self.urls

	def scrape_url(url):

	def choose_words(self):