import { NextPage } from "next";
const List: NextPage = () => {
  return (
    <>
      <div className="w-3/4 h-2/6 overflow-y-scroll p-5 mx-auto">
        <div className="flex flex-col rounded-2xl justify-center items-center p-2 px-12 space-y-8">
          <div className="overflow-x-auto w-full shadow">
            <table className="table w-full text-center">
              {/* head */}
              <thead>
                <tr>
                  <th />
                  <th>Address</th>
                  <th>Type</th>
                  <th>Time stamp</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Desktop Support Technician</td>
                  <td>Purple</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                  <td>Red</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
