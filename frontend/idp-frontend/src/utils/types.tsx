type CountryButtonProps = {
    countryName: string;
    // You can add more props and their types here if needed
};

type SideMenuProps = {
    countryNames: { name: string; }[]
}

export type {
    CountryButtonProps, 
    SideMenuProps
};

