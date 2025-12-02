import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: number;
    userRol?: string;
}
export declare const verificarToken: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=middleware.d.ts.map