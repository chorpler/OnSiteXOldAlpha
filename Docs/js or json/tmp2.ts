export enum VALIDSTATE {
	'invalid' = 0,
	'pending' = 1,
	'valid'   = 2
}

export enum TOKENMSG {
	'Validation failed'     = 0,
	'Validation is Pending' = 1,
	'Valid User Connected'  = 2
}

// firstName	uidString1	lastName

export const userUuid = OSXU.firstName + OSXU.uidString1 + OSXU.lastName;

export interface userToken {
	_id: userUuid;
	userName: OSXU.name;
	password: ISXU.password;
	tokenStatus: VALIDSTATE;
	message: TOKENMSG;
}