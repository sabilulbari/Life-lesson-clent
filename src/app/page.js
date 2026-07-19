import Hero from "@/components/home/Hero";
import FeaturedLession from "@/components/home/FeaturedLession";
import StaticItems from "@/components/home/StaticItems";







export default async function Home() {
 

  return (
    <div className="space-y-16 pb-12">

      {/*hero and Slider */}
      <Hero/>
      

      {/* 2. Featured Life Lessons Section */}
      <FeaturedLession/>

      {/* 3. Why Learning From Life Matters (Static Benefits) */}
      <StaticItems/>

    </div>
  );
}


