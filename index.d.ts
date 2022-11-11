type options = {
    accidentalNumberPreference:number;
    preferSharpsOrFlats:number
}

export function transposeABC(abc:string, halfSteps:number, opts?:options) : string;