import React, { useEffect, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import "./CarReg.css";
import loader from "../assets/loader.gif";


const CarReg = () => {

     const [CarInfo, setCarInfo] = useState({
    CarBrand: "",
    Model: "",
    Mileage: "",
    Price: "",
    Condition: "",
    Color: "",
    Country: "",
    CarPics: "",
  });

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    async function getAllCountries() {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/",
      );
      const data = await response.json();

      console.log(data);
      setCountries(data.data);
    }

    getAllCountries();
  }, []);

  const [showLoader, setShowLoader] = useState(false);

  const formSubmit = async (e) => {
      e.preventDefault();
    try{
        
    setShowLoader(true);
    console.log(CarInfo);
     const res = await fetch(
      "https://6ace3b86f338359cf1c34d78.mockapi.io/CarReg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(CarInfo),
      },
    );

    console.log("successful");
    setShowLoader(false);
    toast("registration is successful", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

     setCarInfo({
    CarBrand: "",
    Model: "",
    Mileage: "",
    Price: "",
    Condition: "",
    Color: "",
    Country: "",
     })

       }catch(err){
        console.log(err);
        toast("registration is unsuccessful, try again", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    setShowLoader(false);


    }
      
  };

  return (
    <div className="cars-reg">
      <h3>Register a Car</h3>
      <p>Input the correct details of the cars below</p>

      <form onSubmit={formSubmit}>
        <div className="input-group">
          <label>CarBrand</label>
          <input
            type="text"
            placeholder="Brand Name"
            required
            value={CarInfo.CarBrand}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, CarBrand: e.target.value })
            }
          />
          <div className="error"></div>
        </div>

        <div className="input-group">
          <label>Model</label>
          <input
            type="text"
            placeholder="Car Model"
            required
            value={CarInfo.Model}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, Model: e.target.value })
            }
          />
          <div className="error"></div>
        </div>

        <div className="input-group">
          <label>Mileage</label>
          <input
            type="text"
            placeholder="Car Mileage"
            value={CarInfo.Mileage}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, Mileage: e.target.value })
            }
          />
          <div className="error"></div>
        </div>

        <div className="input-group">
          <label>Price</label>
          <input
            type="text"
            placeholder="Car Price"
            required
            value={CarInfo.Price}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, Price: e.target.value })
            }
          />
          <div className="error"></div>
        </div>

        <div className="input-group">
          <label>Condition</label>
          <input
            type="text"
            placeholder="Car Condition"
            required
            value={CarInfo.Condition}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, Condition: e.target.value })
            }
          />
          <div className="error"></div>
        </div>

        <div className="input-group">
          <label>Color</label>
          <input
            type="text"
            placeholder="Car Color"
            required
            value={CarInfo.Color}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, Color: e.target.value })
            }
          />
          <div className="error"></div>
        </div>

        
        <div className="input-group">
          <label>Country:</label>
          <select
            required
            value={CarInfo.Country}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, Country: e.target.value })
            }
          >
            <option value="">Select Your Country</option>
            {countries.map((item) => (
              <option value={item.country}>{item.country}</option>
            ))}
          </select>

          <div className="error"></div>
        </div>

        <div className="input-group">
          <label>Car Image</label>
          <input
            type="url"
            placeholder="Upload your img on cloudinary and paste url"
            required
            value={CarInfo.CarPics}
            onChange={(e) =>
              setCarInfo({ ...CarInfo, CarPics: e.target.value })
            }
          />
          <div className="error"></div>
        </div>
        
        <button>
          {showLoader === true ? (
            <img className="loader-img" src={loader} alt="loader" />
          ) : (
            "Register Cars"
          )}
        </button>
      </form>
    </div>
  );
};

export default CarReg