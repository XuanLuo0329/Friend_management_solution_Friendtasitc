import React, { useState, useEffect } from 'react';
import useGet from './useGet';
import useDelete from './useDelete';
import { Link, useNavigate } from 'react-router-dom'; 
import ConfirmationDialog from './Components/ConfirmationDialog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ShowAllFriends = () => {
  const { data: profiles } = useGet(`${API_BASE_URL}/api/user/friend`, []);
  const { deleteData } = useDelete();
  const [ isDialogOpen, setIsDialogOpen] = useState(false);
  const [ selectedId, setSelectedId] = useState(null);
  const { error: verifyError } = useGet(`${API_BASE_URL}/api/auth/verifyToken`, null);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    await deleteData(`${API_BASE_URL}/api/user/friend/${selectedId}`);
    setIsDialogOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (verifyError) {
      navigate('/login');
    }
  }, [verifyError, navigate]);

  return (
    <div className="relative min-h-screen">
      <div className="pt-15 px-4 sm:px-6 lg:px-8 my-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">All contacts</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all contacts in your account including their name, birthday, relationship. You can view and edit their details.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => window.location.href = '/createProfile'}
            >
              Add new contact
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300  bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300  bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300  bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Birthday
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300  bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Relationship
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300  bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">View</span>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300  bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile, profileIdx) => (
                    <tr key={profile.name}>
                      <td
                        className={classNames(
                          profileIdx !== profiles.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                        )}
                      >
                        {profile.name}
                      </td>
                      <td
                        className={classNames(
                          profileIdx !== profiles.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell'
                        )}
                      >
                        {profile.gender}
                      </td>
                      <td
                        className={classNames(
                          profileIdx !== profiles.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                        )}
                      >
                        {new Intl.DateTimeFormat('en-US', { dateStyle: 'full', },).format(new Date(profile.birthday))}
                      </td>

                      <td
                        className={classNames(
                          profileIdx !== profiles.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell'
                        )}
                      >
                        {profile.relationship}
                      </td>
                      <td className="whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" onClick={() => handleDelete(profile._id)} className="text-indigo-600 hover:text-indigo-900 pr-4">
                          Remove<span className="sr-only"></span>
                        </a>
                        <Link to={`/createProfile/${profile._id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only"></span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ShowAllFriends;
