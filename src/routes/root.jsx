import {
  Outlet,
  NavLink,
  useLoaderData,
  useNavigation,
  Form,
  redirect,
  useSubmit,
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
  const submit = useSubmit();
  // console.log("root, useNavigation returns: ", navigation);

  function submitHandler(e) {
    console.log("submitHandler, event: ", e);
    console.log("submitHandler, e.target.value: ", e.target.value);
    console.log("submitHandler, e.currentTarget: ", e.currentTarget);
    console.log("submitHandler, e.currentTarget.form: ", e.currentTarget.form);
    const isFirstSearch = q == null;
    console.log("q and isFirstSearch: ", q, "--", isFirstSearch);
    submit(e.currentTarget.form, { replace: !isFirstSearch });
  }

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  console.log("navigation.state: ", navigation.state);
  console.log("navigation.location: ", navigation.location);
  if (navigation.location) {
    console.log(
      'new URLSearchParams(navigation.location.search).has("q")): ',
      new URLSearchParams(navigation.location.search).has("q")
    );
    console.log(
      "new URLSearchParams(navigation.location.search).toString(): ",
      new URLSearchParams(navigation.location.search).toString()
    );
  }

  // console.log("in Root, contacts: ", contacts);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts here</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(e) => submitHandler(e)}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
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
