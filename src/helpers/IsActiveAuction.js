
export function IsActiveAuction(props){

  
        let ending = parseInt(props.end_time) * 1000
        let starting = parseInt(props.start_time) * 1000
        let now = Date.now()
        //console.log(ending,starting,now)
        if (starting > now) {
            return false
        }
        if (ending < now) {
            return false
        }
        return true
    

}