class ApiResponse{
    constructor(statsCode,data,message="Success"){
        this.statsCode = statsCode,
        this.data = data,
        this.meesage = message,
        this.success = statsCode < 400 
    } 
}
export {ApiResponse}