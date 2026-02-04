import { useEffect, useState } from "react";
import {fetchProviders} from "../../../api/client";

const Providers = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchBy, setSearchBy] = useState("Id");
    const [shownIndex, setShownIndex] = useState(0);
    const PAGE_SIZE = 10;
    const providersOnDisplay = providers.slice(shownIndex, shownIndex + PAGE_SIZE);

    // Functions that show records on the table
    const showNextBatch = () => {
        setShownIndex(prev => prev + PAGE_SIZE < providers.length ? prev + PAGE_SIZE : prev);
    };
    const showPrevBatch = () => {
        setShownIndex(prev => prev - PAGE_SIZE >= 0 ? prev - PAGE_SIZE : 0);
    };
    const handleChange = (e) => {
        setSearchBy(e.target.value);
    };

    useEffect(()=>{
        const loadProviders = async () => {
            try{
                const response = await fetchProviders();
                const sortedProviders = response.data.slice().sort((a,b) => a.id - b.id);
                setProviders(sortedProviders);
            } catch (e) {
                setError("Failed to fetch providers");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadProviders();
    }, []);

    if (loading) return <p>Loading Providers ...</p>;
    if (error) return <p>{error}</p>

    return(
        <section className="providers">
            <h2>Providers</h2>
            <input type="text" placeholder={`Search by ${searchBy}`} id="searchBar"/>
            <select value={searchBy} name="searchBy" onChange={handleChange}>
                <option disabled hidden value={""}>Search by</option>
                <option value={"Id"}>Id</option>
                <option value={"First Name"}>First Name</option>
                <option value={"Last Name"}>Last Name</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {providersOnDisplay.map(provider => (
                        <tr key={provider.id}>
                            <td>{provider.id}</td>
                            <td>{provider.first_name+" "+provider.last_name}</td>
                            <td>{provider.gender}</td>
                            <td>{provider.email}</td>
                        </tr>
                    ))}
                </tbody>  
            </table>
            <span style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly',marginTop:'8px'}}><p style={{opacity: shownIndex === 0 ? '0.5' : '1'}} onClick={showPrevBatch}>Prev</p><p style={{opacity: shownIndex + PAGE_SIZE >= providers.length ? '0.5' : '1'}} onClick={showNextBatch}>Next</p></span>
        </section>
    );
};

export default Providers;