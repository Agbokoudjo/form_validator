/**
 * Représente une erreur d'API
 * @property {{
*  violations: {propertyPath: string, message: string}
* }} data
*/
export class ApiError {
 constructor (private data:any, private status:any) {}

}
