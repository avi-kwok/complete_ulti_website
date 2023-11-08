


$("#add_user").submit(function(event){
    alert("New player created successfully.");
})

$("#add_match").submit(function(event){
    alert("New match initalized.");
})

$("#update_user").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })
    
    var request = {
        "url" : `http://localhost:3000/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Player updated successfully.");
        window.location.href = "http://localhost:3000/"
    })
})

if(window.location.pathname == "/"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this player?")){
            $.ajax(request).done(function(response){
                alert("Player deleted successfully.");
                location.reload();
            })
        }

    })
}

if(window.location.pathname == "/match-history"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/matchHistory/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this match record?")){
            $.ajax(request).done(function(response){
                alert("Match Record deleted successfully.");
                location.reload();
            })
        }

    })
}

if(window.location.pathname == "/leaderboard"){
    $ondelete = $(".table th #factory");
    $ondelete.click(function(){
        var request = {
            "url" : `http://localhost:3000/api/users`,
            "method" : "PUT"
        }

        if(confirm("WARNING: This will reset ALL player data. Are you sure?")){
            $.ajax(request).done(function(response){
                alert("All existing player data has been reset.");
                location.reload();
            })
        }

    })
}






