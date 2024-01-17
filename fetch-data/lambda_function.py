import json
import requests

def find_organizations(country):
    def has_tags(tags, required_tags):
        return all(any(tag['display_name'] == required_tag for tag in tags) for required_tag in required_tags)

    def get_datasets(query, filter_query):
        url = f"https://data.humdata.org/api/action/package_search?q={query}&fq={filter_query}&start=0&rows=1000"

        # Making the GET request
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()['result']['results']
        else:
            return None

    # Main execution
    query = "internally displaced persons-idp"
    filter_query = f"groups:{country}"
    required_tags = ['hxl', 'internally displaced persons-idp']

    data = get_datasets(query, filter_query)

    organizations = set()
    dataset_count = 0
    for dataset in data:
        if has_tags(dataset['tags'], required_tags):
            dataset_count += 1
            organizations.add(dataset['organization']['name'])
    return organizations

print(find_organizations('sdn'))
