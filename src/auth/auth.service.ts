import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    signin(){
        return {
            msg:'hello from signin'
        };
    }
    signup(){
        return {
            msg:'hello from signup'
        };
    }
}