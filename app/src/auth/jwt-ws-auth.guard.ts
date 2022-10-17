import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext) {
    //const request = context.switchToWs()();
    const data = context.switchToWs().getData();
    console.log(data.authorization);
    const res = this.jwtService.verify(data.authorization);
    console.log(res);
    return false;
  }
  /*  handleRequest(err: any, user: any, info: any, context) {
    const request = context.switchToWs().getRequest();
    const data = context.switchToWs().getData();

    console.log(request);
    console.log(data);

    request.user = user;
    return user;
  }*/
}

/*@Injectable()
export class JwtWsAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context) {
    const request = context.switchToWs().getRequest();
    const data = context.switchToWs().getData();

    console.log(request);
    console.log(data);

    request.user = user;
    return user;
  }
}*/
