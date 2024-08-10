'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { getDocs, collection, query, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { getRecipes } from "@/spoonacular";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [recipes, setRecipes] = useState([]);
  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const fetchRecipes = async () => {
    const ingredientNames = inventory.map((item) => item.name);
    const fetchedRecipes = await getRecipes(ingredientNames);
    setRecipes(fetchedRecipes);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      padding={4}
      bgcolor="#f5f5f5"
      gap={3}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" textAlign="center">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpen}
      >
        Add New Item
      </Button>
      <Button 
        variant="contained" 
        color="secondary"
        onClick={fetchRecipes}
      >
        Get Recipes
      </Button>
      
      <Box border='1px solid #ddd' borderRadius="8px" padding={2} bgcolor="white" width="100%" maxWidth="800px">
        <Box
          height="100px" 
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderBottom="1px solid #ddd"
        >
          <Typography variant="h4" color="#333" textAlign="center">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="100%" spacing={2} maxHeight="400px" overflow="auto" padding={2}>
          {inventory.map(({ name, quantity }) => (
            <Card key={name} variant="outlined" sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant="h6" component="div">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <Stack direction="row" spacing={1}>
                <IconButton color="primary" onClick={() => addItem(name)}>
                  <AddCircleIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => removeItem(name)}>
                  <RemoveCircleIcon />
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>

      {recipes.length > 0 && (
        <Box 
          mt={4} 
          width="100%" 
          maxWidth="800px"
        >
          <Typography variant="h4" mb={2}>Recipes:</Typography>
          <Stack spacing={3}>
            {recipes.map((recipe) => (
              <Card key={recipe.id} variant="outlined" sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={recipe.image}
                  alt={recipe.title}
                  sx={{ borderRadius: '8px', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Used Ingredients:
                  </Typography>
                  <ul>
                    {recipe.usedIngredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.original}
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body1" fontWeight="bold">
                    Missed Ingredients:
                  </Typography>
                  <ul>
                    {recipe.missedIngredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.original}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
