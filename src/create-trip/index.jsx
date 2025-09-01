import React, { useState, useEffect } from 'react'
// Remove react-google-places-autocomplete import
import { Button } from '../components/ui/button'
import PlaceAutocomplete from '../components/PlaceAutocomplete'
import { generateTravelPlan } from '../service/AIModal';
import { useNavigate } from 'react-router-dom';
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
  const [openDailog, setOpenDailog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

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


  // Removed unused runAI helper

  const login = useGoogleLogin({
    onSuccess: (codeResp) => console.log(codeResp),
    onError: (error) => console.log(error)
  })

  const OnGenerateTrip = async () => {

    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDailog(true);
      return;
    }

    if ((formData?.noOfDays > 10) || !formData?.location || !formData?.budget || !formData?.traveler) {
      alert("Please fill all details and keep days ≤ 10")
      return;
    }

    setIsGenerating(true);
    try {
      const locationName = formData?.location?.name || formData?.location?.address;
      const days = Number(formData?.noOfDays) || 3;
      const group = formData?.traveler || 'Couple';
      const budget = formData?.budget || 'Cheap';

      const planText = await generateTravelPlan(locationName, days, group, budget);
      if (!planText) {
        alert('Failed to generate plan');
        return;
      }
      localStorage.setItem('tripResult', planText);
      navigate('/result');
    } catch (e) {
      console.error(e);
      alert('Something went wrong while generating your trip.');
    } finally {
      setIsGenerating(false);
    }
  }

  const GetUserProfile = (tokenInfo) => {
    axious.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
      {

        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json'
        }
      }).then((resp) => {
        console.log(resp);
      })
  }




  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8 md:mt-10'>
      <div className="max-w-4xl mx-auto">
        <h2 className='text-2xl sm:text-3xl font-bold text-center sm:text-left'>
          Tell us your travel preferences🏕️🌴
        </h2>
        <p className='mt-3 text-gray-500 text-sm sm:text-md text-center sm:text-left'>
          Just provide some basic information, and our trip planner will generate a customised itinerary based on your preferences
        </p>
      </div>


      <div className='mt-12 sm:mt-16 md:mt-20 flex flex-col gap-8 sm:gap-10'>
        <div>
          <h2 className='text-lg sm:text-xl my-3 font-medium'>
            What is your destination?
          </h2>
          <PlaceAutocomplete
            onSelect={(place) => handleInputChange('location', place)}
          />
        </div>


        <div>
          <h2 className='text-lg sm:text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <input placeholder="Ex.3" type="number" className="border rounded px-3 py-2 w-full"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)} />
        </div>



        <div>
          <h2 className='text-lg sm:text-xl my-3 font-medium'>
            What is your budget?
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-3 sm:p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all
              ${formData?.budget == item.title && 'shadow-lg border-black'}
            `}>
                <h2 className='text-3xl sm:text-4xl'>
                  {item.icon}
                </h2>
                <h2 className='font-bold text-base sm:text-lg'>
                  {item.title}
                </h2>
                <h2 className='text-xs sm:text-sm text-gray-500'>
                  {item.desc}
                </h2>
              </div>
            ))}
          </div>
        </div>


        <div>
          <h2 className='text-lg sm:text-xl my-3 font-medium'>
            Who do you plan on travel with on your next adventure?
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5'>
            {SelectTravelesList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-3 sm:p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all
              ${formData?.traveler == item.people && 'shadow-lg border-lg border-black'}
            `}>
                <h2 className='text-3xl sm:text-4xl'>
                  {item.icon}
                </h2>
                <h2 className='font-bold text-base sm:text-lg'>
                  {item.title}
                </h2>
                <h2 className='text-xs sm:text-sm text-gray-500'>
                  {item.desc}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='my-8 sm:my-10 flex justify-center sm:justify-end'>
        <Button onClick={OnGenerateTrip} disabled={isGenerating} className="w-full sm:w-auto px-8 py-3">
          {isGenerating ? 'Generating...' : 'Generate Trip'}
        </Button>
      </div>

      {openDailog && <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" />
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