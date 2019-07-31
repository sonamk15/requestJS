const fetchUrl = require("fetch").fetchUrl;
const raw_input = require('readline-sync').question;
const BASE_URL= "http://saral.navgurukul.org/api/courses";

function getcourses(BASE_URL,callback){
    var Id = []
    fetchUrl(BASE_URL, function(err,meta,body){
        // console.log(body.toString())
        if (err){
            // console.log(err.toString())
        }else{
            var data = JSON.parse(body) 
            var availableCourses = data["availableCourses"]
            for (let index = 0; index < availableCourses.length; index++) {
                console.log(index+1, availableCourses[index]["name"])
                Id.push(availableCourses[index]["id"])
            }
            var input = raw_input("which course you want>>>")
            var course_id = Id[input]
        
            return getEx(course_id)
        }
        function getEx(course_id,callback){
            var slug_list = []
            const EX_URL = BASE_URL + `/${course_id}/exercises`
            fetchUrl(EX_URL, function(err,meta,body){
                if (err){
                    console.log(err)
                }else{
                    var ex_data = JSON.parse(body)
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

                }
                function getContent(course_id,slug_input){
                    const slug_url = `http://saral.navgurukul.org/api/courses/` + course_id + `/exercise/getBySlug?slug=` + slug_input;
                    fetchUrl (slug_url, function(err,meta,body){
                        if (err){
                            console.log(err)
                        }else{
                            var ex_content = JSON.parse(body)
                            console.log(ex_content.content) 
                        }
                    })
                }
            })

        }
    })
}
getcourses(BASE_URL)