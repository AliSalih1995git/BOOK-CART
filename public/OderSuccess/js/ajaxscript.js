function addTocart(proId){
		$.ajax({
			url:'/add-tocart/'+proId,
			method:'get',
			success:(response)=>{
				if(response.status){
					let count=$('#cart-count').html()
					counts=parseInt(count)+1
					$('#cart-count').html(counts)
				}
				
			}
		})
	}
	function addTowishlist(proId){
		$.ajax({
			url:'/add-Towishlist/'+proId,
			method:'get',
		
			success:(response)=>{
				alert(response)
				
			}
		})
	}
	
	