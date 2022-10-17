import { useEffect, useState } from 'react';
import Grid from '../../components/Grid';
import { ytApi } from '../../lib/api/api';

const Home = ({ onClick }) => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    async function fetchPopular() {
      const {
        data: { items },
      } = await ytApi.getPopular();

      setItems(items);
    }

    fetchPopular();
  }, []);

  return (
    <>
      <Grid items={items} title="인기 뮤직 비디오" onClick={onClick} />
    </>
  );
};

export default Home;
