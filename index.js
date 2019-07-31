const fetch = require('node-fetch');
// js me ham inpute lene ke liye 
//  sync  ka use karte hai
const raw_input = require('readline-sync').question;
 
const BASE_URL= "http://saral.navgurukul.org/api/courses";

function space(){
    console.log("-----------------------------------------------------------")
}


var Id = []
function getCourses(BASE_URL, callback){
    fetch(BASE_URL)
    .then(response => response.json())
    .then(data => {
        // console.log(data)
        var availableCourses = (data["availableCourses"]) // Prints result from `response.json()` in getRequest
        for (let index = 0; index < availableCourses.length; index++) {
            console.log(index+1, availableCourses[index]["name"])
            Id.push(availableCourses[index]["id"])

            
        }
        var input = raw_input("which course you want>>>")
        var course_id = Id[input]
    
        return callback(course_id)
    })

    .catch(error => console.error(error))
}
// getCourses(BASE_URL)
function getExe(course_id,callback){
    space()
    var slug_list = []
    const EX_URL = BASE_URL + `/${course_id}/exercises`
    fetch(EX_URL)
    .then(response => response.json())
    .then(ex_data =>{
        var all_exercise = (ex_data.data)
        let count = 1;
        for (let i = 0; i < all_exercise.length; i++) {
            const exercise = all_exercise[i];
            let exercise_name = (exercise.name)
            slug_list.push(exercise.slug)
            console.log(count, exercise_name, "parantal")
            count++;

            for (let i = 0; i < exercise.childExercises.length; i++) {
                const child_exercise = exercise.childExercises[i];
                let child_exercise_name = (child_exercise.name)
                slug_list.push(child_exercise.slug)
                console.log(count, child_exercise_name, "chils")
                count++;
            }
        }
        var slug_input = raw_input('enter your id')
        var  slugID = slug_list[slug_input - 1]

        return getContent(course_id,slugID)
    })
   

}

function getContent(course_id,slug_input){
    space()
    const slug_url = `http://saral.navgurukul.org/api/courses/` + course_id + `/exercise/getBySlug?slug=` + slug_input;
    // console.log(slug_url)
    fetch(slug_url)
    .then(response => response.json())
    .then(datacontent =>{
    console.log(datacontent.content)
    })

}

getCourses(BASE_URL,getExe)