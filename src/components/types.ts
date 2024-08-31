export type derivationPathType = {
    name: string;
    derviationPath: string;
    image?: string;
    selected?:boolean;
    publicKey?:string;
    privateKey?:string | Uint8Array;
    sign?:string;
  };

export type createSolanaWalletType=(value1:derivationPathType,value2:number,seed:Buffer)=>derivationPathType;