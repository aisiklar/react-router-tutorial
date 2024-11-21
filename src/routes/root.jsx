import {
  Outlet,
  NavLink,
  useLoaderData,
  useNavigation,
  Form,
  redirect,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export async function loader({ request }) {
  console.log("in root loader, request: ", request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  console.log("in root loeader, searchparams q: ", q);
  const contacts = await getContacts(q);
  // console.log("in loader, contacts: ", contacts);
  return { contacts, q };
}

export async function action({ params }) {
  console.log("in action, will create contact soon...params: ", params);
  const contact = await createContact();
  // console.log("in action, created contact: ", contact);
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  console.log("in root");
  const { contacts, q } = useLoaderData();
  console.log("root, q: ", q);
  const navigation = useNavigation();
  // console.log("root, useNavigation returns: ", navigation);

  // console.log("in Root, contacts: ", contacts);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts here</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
