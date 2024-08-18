export type derivationPathType = {
    name: string;
    derviationPath: string;
    image?: string;
    selected?:boolean;
    publicKey?:string;
    privateKey?:string | Uint8Array;
    sign?:string;
  };