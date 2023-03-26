import React from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";
import Slider from "react-slick";
import firstPhoto from "./WebPhotos/WebPhoto1.png";
import secondPhoto from "./WebPhotos/WebPhoto2.png";
import thirdPhoto from "./WebPhotos/WebElShopPhoto.png";

// Settings for the slider
const settings = {
  dots: false,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const HomePage = () => {
  const cards = [
    {
      title: "Neformalus ugdymas",
      text: "Pradėti mokytis programavimo niekada nėra per vėlu",
      image: firstPhoto,
    },
    {
      title: "Pasiruošimas egzaminui",
      text: "Programavimo uždaviniai skirti pasiruošti valstybiniui informacinių technologijų brandos egzaminui (VBE)",
      image: secondPhoto,
    },
    {
      title: "El. Parduotuvė",
      text: "Elektroninėje parduotuvėje rasite visas knygas, kurios padės įsisavinti programavimo žinias",
      image: thirdPhoto,
    },
  ];

  return (
    <Box
      className="sliderBox"
      height={"100vh"}
      overflow={"hidden"}
      pointerEvents="none"
    >
      {/* Slider */}
      <Slider {...settings}>
        {cards.map((card, index) => (
          <Box
            key={index}
            height={"6xl"}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundImage={`url(${card.image})`}
          >
            {/* This is the block you need to change, to customize the caption */}
            <Container height="600px" position="relative">
              <Stack
                spacing={6}
                w={"full"}
                maxW={"lg"}
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
              >
                <Heading
                  textColor={"white"}
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                >
                  {card.title}
                </Heading>
                <Text textColor={"white"} fontSize={{ base: "md", lg: "lg" }} width={{base: "200px", md: "500px", }}>
                  {card.text}
                </Text>
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
export { HomePage };
