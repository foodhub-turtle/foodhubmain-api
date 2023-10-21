import axios from 'axios';

var distance = require('google-distance-matrix');
const googleApiKey = process.env.GOOGLE_API_KEY;
export const getBranchDistanceById = async (origin, destination) => {
    // try {
    //     const response = await axios.get(
    //       `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${googleApiKey}`
    //     );
    
    //     if (response.data.status === 'OK') {
    //       const distanceText = response.data.rows[0].elements[0].distance.text;
    //       const distanceDuration = response.data.rows[0].elements[0].duration.text;
    //       return {
    //         branchDistance: {
    //             distance: {
    //                 text: distanceText
    //             },
    //             duration: {
    //                 text: distanceDuration
    //             }
    //         }
    //     };
    //       console.log(`Distance between ${origin} and ${destination}: ${distanceText} and Duration is ${distanceDuration}`);
    //     } else {
    //       console.error('Error calculating distance:', response.data.status);
    //     }
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    return {
        branchDistance: {
            distance: {
                text: Math.floor((Math.random()*9) + 1)+' '+'km'
            },
            duration: {
                text: Math.floor((Math.random()*9) + 1)+' '+'mins'
            }
        }
    };
    // return new Promise((resolve, reject) => {
    //     distance.matrix(origin, destination, function (err, distances) {
    //         if (err) {
    //         return console.log(err);
    //         }
    //         if(!distances) {
    //             return console.log('no distances');
    //         }
    //         if (distances.status == 'OK') {
    //             if (distances.rows[0].elements[0].status == 'OK') {
    //                 resolve({
    //                     branchDistance: distances.rows[0].elements[0]
    //                 });
    //             } else {
    //                 // console.log(destination + ' is not reachable by land from ' + origin);
    //             }
    //         }
    //       if (err) reject(err);
          
    //     })
    // });
};