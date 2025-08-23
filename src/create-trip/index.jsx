import React, { useState, useEffect } from 'react'
// Remove react-google-places-autocomplete import
import { Button } from '../components/ui/button'
import PlaceAutocomplete from '../components/PlaceAutocomplete'
import { AI_PROMPT } from '@/constants/options'
import { generateTravelPlan } from '../service/AIModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin, useGoogleOAuth } from '@react-oauth/google';


const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '🪙',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💰',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Dont worry about costs',
    icon: '💸',
  },
]
const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveles in exploration',
    icon: '✈️',
    people: '1'
  },
  {
    id: 2,
    title: 'A couple',
    desc: 'A traveles with a companion',
    icon: '🥂',
    people: '2'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A traveles with family members',
    icon: '🏡',
    people: '3 to 5 people'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekes',
    icon: '👯‍♂️',
    people: '5 to 10 people'
  },
]

function CreateTrip() {
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState([]);
  const[openDailog, setOpenDailog]=useState(false);

  const handleInputChange = (name, value) => {

    if (name == 'noOfDays' && value > 10) {
      console.log("Please enter Trip days less than 10")
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(formData);
  }, [formData])


  async function runAI() {
    try {
      const plan = await generateTravelPlan("Las Vegas", 3, "Couple", "Cheap");
      console.log(JSON.stringify(plan, null, 2));
    } catch (err) {
      console.error("Failed to generate travel plan:", err.message);
    }
  }

  const login=useGoogleLogin({
    onSuccess: (codeResp) =>console.log(codeResp),
    onError:(error)=>console.log(error) 
  })

  const OnGenerateTrip = async () => {

    const user=localStorage.getItem('user');

    if(!user)
    {
      setOpenDailog(true);
      return ;
    }

    if (formData?.noOfDays > 10 && !formData?.location || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details")
      return;
    }

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays)

    console.log(FINAL_PROMPT);

    const result = await runAI(FINAL_PROMPT);

    console.log(result?.response?.text());
  }

const GetUserProfile=(tokenInfo)=>
  {
  axious.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
    {

      headers: {
      Authorization: `Bearer ${tokenInfo?.access_token}`,
      Accept: 'Application/json'
    }
    }).then((resp)=>{
      console.log(resp);
    })
  }
 

  

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <div className="max-w-xl mx-auto">
        <h2 className='text-3xl font-bold'>
          Tell us your travel preferences🏕️🌴
        </h2>
        <p className='mt-3 text-gray-500 text-md'>
          Just provide some basic information, and our trip planner will generate a customised itinerary based on your preferences
        </p>
      </div>


      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>
            What is your destination?
          </h2>
          <PlaceAutocomplete
            onSelect={(place) => handleInputChange('location', place.displayName || place.formattedAddress)}
          />
        </div>


        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <input placeholder="Ex.3" type="number" className="border rounded px-3 py-2 w-full"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)} />
        </div>



        <div>
          <h2 className='text-xl my-3 font-medium'>
            What is your budget?
          </h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
              ${formData?.budget == item.title && 'shadow-lg border-black'}
            `}>
                <h2 className='text=4xl'>
                  {item.icon}
                </h2>
                <h2 className='font-bold text-lg'>
                  {item.title}
                </h2>
                <h2 className='text-sm text-gray-500'>
                  {item.desc}
                </h2>
              </div>
            ))}
          </div>
        </div>


        <div>
          <h2 className='text-xl my-3 font-medium'>
            Who do you plan on travel with on your next adventure?
          </h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelesList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
              ${formData?.traveler == item.people && 'shadow-lg border-black'}
            `}>
                <h2 className='text=4xl'>
                  {item.icon}
                </h2>
                <h2 className='font-bold text-lg'>
                  {item.title}
                </h2>
                <h2 className='text-sm text-gray-500'>
                  {item.desc}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='my-10 justify-end flex'>
       <Button onClick={() => setOpenDailog(true)}>Generate Trip</Button>
      </div>

         {openDailog && <Dialog open={openDailog} onOpenChange={setOpenDailog}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>  
          <DialogDescription>
            <img src="/logo.svg"/>
            <h2 className='font-bold text-xl text-red-500'>Sign in with Google</h2>
            <p>Sign in to the App with Google Authentication securely</p>

            <Button 
            onClick={login}
            className="w-full mt-5 flex gap-4 items-center">
              <FcGoogle className='h-7 w-7' />
              Sign in with Google</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>}
    </div>
  )
}
export default CreateTrip