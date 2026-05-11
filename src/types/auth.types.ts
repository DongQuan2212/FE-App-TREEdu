export interface ChangePasswordRequest {
    oldPassword:  string;
    newPassword:  string;
}

export interface ChangePasswordResponse {
    message:    string;
    statusCode: number;
    data:       null;
    timestamp:  string;
}
