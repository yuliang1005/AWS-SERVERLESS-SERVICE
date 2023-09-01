import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData={
    UserPoolId: "us-east-1_kWmmUjp2Q",
    ClientId:"33eeja83c23hoas8jmenbqm3ij"
}

export default new CognitoUserPool(poolData)