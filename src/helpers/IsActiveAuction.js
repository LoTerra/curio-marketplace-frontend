
export function IsActiveAuction(props){

        let ending = 0;
        let starting = 0;
        if(props){
            ending = parseInt(props.end_time) * 1000     
            starting = parseInt(props.start_time) * 1000
        }
        
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