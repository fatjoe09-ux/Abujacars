import { useState } from "react";

import { Link } from "react-router-dom";

import "./About.css";

const team = [

  {

    name: "Nnamdi Henry",

    role: "Founder & CEO AbujaCars",


    photo: "https://res.cloudinary.com/tummi9le/image/upload/v1790347531/joe.jpg",

  },

  // Add more people here: { name, role, photo }

];

const reasons = [

  {

    title: "Wide selection",

    text: "Browse new and used cars from many brands in one marketplace.",

  },

  {

    title: "Easy booking",

    text: "Pick your pickup and return dates, add your details and get a confirmation in minutes.",

  },

  {

    title: "Trusted vendors",

    text: "Every vendor manages their own listings, so prices and availability stay current.",

  },

  {

    title: "Rent or buy",

    text: "Need a car for a weekend or for good? You can do either from the same page.",

  },

];

const stats = [

  { value: "500+", label: "Cars listed" },

  { value: "120+", label: "Vendors" },

  { value: "3,000+", label: "Bookings made" },

];

function TeamCard({ member }) {

  const [failed, setFailed] = useState(false);

  const initials = member.name

    .split(" ")

    .map((n) => n[0])

    .join("");

  return (
<article className="team-card">

      {failed ? (
<div className="team-photo team-initials" aria-hidden="true">

          {initials}
</div>

      ) : (
<img

          className="team-photo"

          src={member.photo}

          alt={`Photo of ${member.name}`}

          onError={() => setFailed(true)}

        />

      )}
<h3>{member.name}</h3>
<p>{member.role}</p>
</article>

  );

}

function About() {

  return (
<main className="about">
<section className="about-hero">
<h1>We make finding the right car simple </h1>
<p>

          Our marketplace connects people who need a car with vendors who have

          one. Browse, compare, and book without the paperwork maze.
</p>
</section>
<section className="about-story">
<div className="about-story-text">
<h2>Our story</h2>
<p>

            We started with a simple frustration: renting or buying a car

            meant calling around, guessing at prices and waiting for replies.
</p>
<p>

            So we built one place where vendors list their cars and customers

            see what is available, what it costs, and whether it is new or

            used. Booking takes a few clicks.
</p>
</div>
<ul className="about-stats">

          {stats.map((s) => (
<li key={s.label}>
<strong>{s.value}</strong>
<span>{s.label}</span>
</li>

          ))}
</ul>
</section>
<section className="about-reasons">
<h2>Why customers choose us</h2>
<div className="reasons-grid">

          {reasons.map((r) => (
<div className="reason" key={r.title}>
<h3>{r.title}</h3>
<p>{r.text}</p>
</div>

          ))}
</div>
</section>
<section className="about-team">
<h2>Meet the team</h2>
<div className="team-grid">

          {team.map((m) => (
<TeamCard member={m} key={m.name} />

          ))}
</div>
</section>
<section className="about-cta">
<h2>Ready to find your car?</h2>
<Link to="/marketplace" className="about-btn">

          Browse cars
</Link>
</section>
</main>

  );

}

export default About;
 