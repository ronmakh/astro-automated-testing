export interface IBrand {
    id: string;
    name: string;
    description: string;
    backgroundColor: string;
    textColor: string;
    website: string;
    language?: string;
    logo?: string;
    favicon?: string;
    ads?: string[];
    header: IBrandHeader;
    footer: IBrandFooter;
  }
  
export interface IBrandHeader {
    navigationItems: ILinkItem[];
}

export interface IBrandFooter {
    navigationItems: ILinkItem[];
    copyrightText: string;
}

export interface ILinkItem {
    link: string;
    text: string;
}