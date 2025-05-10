import React ,{useState} from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
const InputField=({type, placeholder, name,handleChange,address})=>(
    <input className='w-full px-2 py-2.5 border border-gray-300 rounded text-gray-500 outline-none focus:border-primary transition'
     type={type}
        name={name}
        value={address[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required
    
      />
)
const AddAddress = () => {
      const {axios,user,navigate}=useAppContext();
     
    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        email:"",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        phone: ""
    });

    const handleChange=(e)=>{
        const {name, value}=e.target;
        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]:value
        }))
    }
    const onSubmitHandler=async(e)=>{
        e.preventDefault();
         try {
           const {data}=await axios.post('/api/address/add',{address,userId:user._id});
           if(data.success){
            toast.success(data.message);
            navigate('/cart')
           }
           else {
            toast.error(data.message)
           }
         } catch (error) {
            toast.error(error.message)
         }
      }
      useEffect(() => {
        if(!user){
          navigate('/cart');
        }
      }, []);
  return (
    <div className="mt-16 pb-16">
    <p className='text-2xl md:text-3xl font-medium text-gray-500'>Add Shipping <span className='text-primary font-semibold'>Address</span> </p>

    <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
      <div className='flex-1 max-w-md'>
      <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
           <div className="grid grid-cols-2 gap-4">
             <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name"/>
             <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name"/>
           </div>
           <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email"/>
           <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street "/>
           <div className="grid grid-cols-2 gap-4">

           <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="city"/>
           <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="state"/>
           </div>
           <div className="grid grid-cols-2 gap-4">
           <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="country"/>
           <InputField handleChange={handleChange} address={address} name="zipCode" type="number" placeholder="zipCode"/>
           </div>
           <InputField handleChange={handleChange} address={address} name="phone" type="text" placeholder="phone"/>
           <button type='submit' className='w-full mt-6 py-3 bg-primary text-white font-medium hover:bg-primary-dull transition cursor-pointer uppercase'>Add Address</button>
      </form>
      </div>
      <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="add address"/>
    </div>
    </div>
  )
}

export default AddAddress
