import { Request, Response } from 'express';
declare const usersDB: any[];
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { usersDB };
//# sourceMappingURL=controlador.d.ts.map