import { LatLng } from 'leaflet';

export interface Temp {
    s300201: any
    s432301: any
    day : any
    month : any
    year : any
    date: any
    
}

export interface Plot{
    y2012 : number
    y2013 : number
    y2014 : number
    y2015 : number
}

export interface meanplot{
    year : any
    day : any
    300201 : any
    432301 : any
    583201 : any
}

export interface varmonth{
    Dec : any
    Jan : any
    Feb : any
}

export interface Map{
    map:any
}


export interface NC{
    type : any
    geometry : any
    coordinates : any
    properties : any
}
export interface NC_csv{
    lat : any
    lon : any
    temp : any
    year : any
    month : any
}