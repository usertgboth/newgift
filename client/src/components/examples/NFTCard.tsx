import NFTCard from '../NFTCard';
import toyBearImg from '@assets/generated_images/Blue_toy_bear_NFT_bf8296dd.png';

export default function NFTCardExample() {
  return (
    <div className="w-48">
      <NFTCard
        name="Toy Bear"
        itemId="#19295"
        price="29"
        image={toyBearImg}
        backgroundColor="#6BB8D8"
      />
    </div>
  );
}
