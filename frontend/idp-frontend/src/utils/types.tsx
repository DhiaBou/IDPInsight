type SideMenuProps = {
    selectedCountry: string,
    setSelectedCountry: (country: string) => void
}

type ChartContainerProps = {
    selectedCountry: string
}

interface RefreshContainerProps {
    onRefresh: () => void;
}

//------------------------------

type Country = {
    iso3: string,
    name: string
}

type Dataset = {
    //TODO: The dataset should have country type Country
    country: string, 
    id: string, 
    name: string
}


//------------------------------

export type {
    Country,
    Dataset, 
    SideMenuProps,
    ChartContainerProps, 
    RefreshContainerProps
};

