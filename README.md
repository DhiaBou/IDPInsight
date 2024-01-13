# SoftwareEngineering-WS2024-DevGurus

Link to our miroboard: https://miro.com/app/board/uXjVNW4YYdg=/?share_link_id=13166685296  
Pasword for our miroboard: DPUxgWH0UK2ZlXmq

# Process-Data
This README outlines the foundations of the data processing performed in our application.

## HXL
The data processing carried out by our application relies on the [HXL-Standard](https://hxlstandard.org/). Moreover this standard in particular allowed us to perform data cleaning by providing a uniform pattern for column identifiers independent of the relief organisation that created the dataset. For our MVP we limited the set of relief organization to [IOM](https://www.iom.int/). 
An example for the column identifier, so called tags, specified by the HXL-Standard is "#affected+idps+ind" which idenfies a column featuring the number idps. HXL does not specifiy the whole tag but subtags which can be concatenated using "+" and the preceeding "#".

## Cleaning
The cleaning process consists of several steps. Before we actualy perform any operations on the data, we download dataset, mainly excel file from [HDX](https://data.humdata.org/) using their API. Once we obtained all datasets for e.g. a specific country, we open those sheets using pandas.

In the first cleaning step, we scan each sheet of an excel file for the aforementioned HXL-Tags using the official   [HXL-library](https://hxlstandard.github.io/libhxl-python/) for python. In case these tags are present in a given sheet, we verify that the sheets is suited for out application by checking if it contains information about the number of idps.

Since not all datasets are ready for further processing at this point, we perform two additional cleaning step:
* Upwards traversal of the datasets starting from the row containing the HXL-tags. Some datasets feature HXL-tags in the middle in contrast to what the HXL-Standard specifies. 
* Removal of aggregations by filling out location information. Some datasets aggregate the number of idps on a specific country level.
* Adjustment of the date-time-format in accordance with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)

## Processing
During the actually processing we remove rows that do not specify any information with respect to idps and perform some column renaming such that vital column identifiers are more human readable.
The currently existing mapping is shown in the table below.
| HXL Tag               | Description                              |
|-----------------------|------------------------------------------|
| `#affected+idps+ind`  | Affected IDPs Individual Count           |
| `#adm1+name`          | Administrative Level 1 Name              |
| `#date+survey`        | Survey Date                              |
| `#date+occured`       | Occurrence Date                          |
| `#adm0+pcode`         | Country Code                             |
| `#adm2+name`          | Administrative Level 2 Name              |
| `#adm1+origin+pcode`  | Origin Administrative Level 1 Code       |
| `#affected+idps+hh`   | Affected IDPs Household Count            |
| `#adm0+name`          | Country Name                             |
| `#adm2+origin+name`   | Origin Administrative Level 2 Name       |
| `#adm2+pcode`         | Administrative Level 2 Code              |
| `#date+reported`      | Reported Date                            |
| `#adm2+origin+pcode`  | Origin Administrative Level 2 Code       |
| `#adm1+pcode`         | Administrative Level 1 Code              |
| `#adm1+origin+name`   | Origin Administrative Level 1 Name       |


## Further Challenges
The cleaning and renaming functionality we implemented for our mvp is by no means exhaustive. Extending and enhancing this is the main challenge for the future. As additional features user-driven column renaming or text recognition are interesting. Addtionally incorporating data addtional of additional relief agencies like the [UNHCR](https://www.unhcr.org/) may enhanced the quality of our application.
