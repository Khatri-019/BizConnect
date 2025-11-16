import CategoryCard from "./CategoryCard";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

import "./Category.css"


function Category() {
  return (
    <>
      <div className = "category-div">
        <CategoryCard
          Icon={
            <SettingsOutlinedIcon
              className="icon"
              sx={{
                fontSize: "4.2rem",
                color: "#fff",
                backgroundColor: "#165bff",
                padding: "0.86rem",
                borderRadius: "1.3rem",
              }}
            />
          }
          cardTitle={"Getting Started"}
          cardBody={"Setup guides and onboarding help"}
          cardTextSecondary={"24 articles"}
        />

        <CategoryCard
          Icon={
            <VideocamOutlinedIcon
              className="icon"
              sx={{
                fontSize: "4.2rem",
                color: "#fff",
                backgroundColor: "#00c94f",
                padding: "0.86rem",
                borderRadius: "1.3rem",
              }}
            />
          }
          cardTitle={"Video Calls"}
          cardBody={"Troubleshooting call quality and features"}
          cardTextSecondary={"18 articles"}
        />

        <CategoryCard
          Icon={
            <LanguageOutlinedIcon
              className="icon"
              sx={{
                fontSize: "4.2rem",
                color: "#fff",
                backgroundColor: "#ac46ff",
                padding: "0.86rem",
                borderRadius: "1.3rem",
              }}
            />
          }
          cardTitle={"Translation"}
          cardBody={"Language settings and AI translation"}
          cardTextSecondary={"15 articles"}
        />

        <CategoryCard
          Icon={
            <ShieldOutlinedIcon
              className="icon"
              sx={{
                fontSize: "4.2rem",
                color: "#fff",
                backgroundColor: "#fc2b38",
                padding: "0.86rem",
                borderRadius: "1.3rem",
              }}
            />
          }
          cardTitle={"Security & Privacy"}
          cardBody={"Data protection and compliance"}
          cardTextSecondary={"12 articles"}
        />

        <CategoryCard
          Icon={
            <DescriptionOutlinedIcon
              className="icon"
              sx={{
                fontSize: "4.2rem",
                color: "#fff",
                backgroundColor: "#ff6800",
                padding: "0.86rem",
                borderRadius: "1.3rem",
              }}
            />
          }
          cardTitle={"Document Sharing"}
          cardBody={"File uploads and collaboration"}
          cardTextSecondary={"16 articles"}
        />

        <CategoryCard
          Icon={
            <GroupOutlinedIcon
              className="icon"
              sx={{
                fontSize: "4.2rem",
                color: "#fff",
                backgroundColor: "#00bba8",
                padding: "0.86rem",
                borderRadius: "1.3rem",
              }}
            />
          }
          cardTitle={"Account Management"}
          cardBody={"Billing, plans, and team settings"}
          cardTextSecondary={"20 articles"}
        />
      </div>
    </>
  );
}

export default Category;
