### HXL
HXL is supposed to simplify the process of aggregating data provided by different human relief agencies. To this end
so called to with a predefined structure are added in the column below the column names. The uniform format of these tags
are supposed to simplify the parsing process

#### Approach
Since we have to deal with heterogenous data, specifically excel sheets, which itself containd different sheets and in most cases only one actually 
contained these tags. To extract these sheets and the relevant columns, we essentially perform a reduced regex-search to filter to the excel sheets for HXL-tags.
Suited columns are cached and extracted into a .csv file for further processing. The regex-search itself only checks the core tags and the general structure of the whole tag itself.

#### Challenges
As already pointed out, we faced numerous challenges during the cleaning process while working with those excel sheets:
- the dataset did not follow the format of the excel 
- mutilple separate HXL datasets within one HXL dataset below each other
- aggregations within a HXL dataset with cells left empty
