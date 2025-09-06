export interface IUser {
    id: string;
    username: string;
    fullName: string;
    isActive: boolean;
    isAdmin: boolean;
    userBrands: IUserBrands[];
}

export interface IUserBrands {
    role: string;
    brandId: string;
}