import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";
import PropTypes from "prop-types";

export async function loader({ params }) {
  console.log("in loader, contact.jsx...");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found - this is from contact's loader function",
    });
  }
  return { contact };
}

export async function action({ request, params }) {
  console.log("contact / action...");
  const formData = await request.formData();
  for (let i of formData) {
    console.log("formData i: ", i);
  }
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  console.log("in Contact...");
  const { contact } = useLoaderData();
  console.log("contact: ", contact);
  console.log("contact.first || contact.last: ", contact.first || contact.last);
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://robohash.org/you.png?size=200x200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.id}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Favorite.propTypes = {
//   contact: PropTypes.string.isRequired,
// };

function Favorite({ contact }) {
  const fetcher = useFetcher();

  // const favorite = contact.favorite;
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  // rephrase of above statements to log the process
  // let favorite;
  // if (fetcher.formData) {
  //   console.log("#1 fetcher.formData true");
  //   console.log(
  //     '#1 fetcher.formData.get("favorite") ',
  //     fetcher.formData.get("favorite")
  //   );
  //   console.log(
  //     '#1 fetcher.formData.get("favorite") === "true": ',
  //     fetcher.formData.get("favorite") === "true"
  //   );
  //   favorite = fetcher.formData.get("favorite") === "true";
  // } else {
  //   console.log("#1 fetcher.formData false");
  //   console.log("contact.favorite: ", contact.favorite);
  //   favorite = contact.favorite;
  // }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
