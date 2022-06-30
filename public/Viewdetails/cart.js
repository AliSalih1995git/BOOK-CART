

function addTocart(proId){
    $.ajax({
        url:'/add-tocart/'+proId,
        method:'get',   
        success:(response)=>{
            if(response.status){
                Swal.fire(
                    'added to Cart!',
                    'product added to Cart.',
                    'success'
                )
                let count=$('#cart-count').html()
                let counts=parseInt(count)+1
                $('#cart-count').html(counts)
                 
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    footer: '<a href="/login" class=text-primary bold>Please Login</a>'
                  })
            }            
        }
    })
}

function addTowishlist(proId){
    $.ajax({
        url:'/add-Towishlist/'+proId,
        method:'get',
    
        success:(response)=>{
            if(response.status){
                Swal.fire(
                    'added to Wishlist!',
                    'product added to Cart.',
                    'success'
                )
                location.reload()
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    footer: '<a href="/login" class=text-primary>Please Login</a>'
                  })
            }
            
        }
    })
}
