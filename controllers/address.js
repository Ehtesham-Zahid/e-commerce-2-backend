const Address = require("../models/address");
const catchAsync = require("../utils/catchAsync");

exports.getAddresses = catchAsync(async (req, res, next) => {
  let addresses = await Address.find({ user: req.user._id });
  addresses = addresses.sort((a, b) => b.isPrimary - a.isPrimary);

  res.json(addresses);
});

exports.getPrimaryAddress = catchAsync(async (req, res, next) => {
  const primaryAddress = await Address.findOne({
    user: req.user._id,
    isPrimary: true,
  });

  if (!primaryAddress) {
    return res.status(404).json({ error: "Primary address not found" });
  }

  res.json(primaryAddress);
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.addressId);

  if (!address) {
    return res.status(404).json({ error: "Address not found" });
  }

  res.json(address);
});

exports.addAddress = catchAsync(async (req, res, next) => {
  const { firstName, lastName, phoneNumber, city, address, zipcode, country } =
    req.body;

  let { isPrimary } = req.body;

  // If this is the first address, make it primary
  const existingAddresses = await Address.find({ user: req.user._id });
  if (existingAddresses.length === 0) {
    isPrimary = true;
  }

  if (isPrimary) {
    // If the updated address is to be primary, unset previous primary address
    await Address.updateMany(
      { user: req.user._id, isPrimary: true },
      { isPrimary: false }
    );
  }

  const newAddress = new Address({
    user: req.user._id,
    firstName,
    lastName,
    phoneNumber,
    city,
    address,
    zipcode,
    country,
    isPrimary,
  });

  const createdAddress = await newAddress.save();
  res.status(201).json(createdAddress);
});

// exports.updateAddress = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const address = await Address.findById(id);

//   if (!address) {
//     return res.status(404).json({ error: "Address not found" });
//   }

//   address.firstName = req.body.firstName || address.firstName;
//   address.lastName = req.body.lastName || address.lastName;
//   address.address = req.body.address || address.address;
//   address.city = req.body.city || address.city;
//   address.phoneNumber = req.body.phoneNumber || address.phoneNumber;
//   address.zipcode = req.body.zipcode || address.zipcode;
//   address.country = req.body.country || address.country;

//   const updatedAddress = await address.save();
//   res.json(updatedAddress);
// });

exports.updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);

  if (!address) {
    return res.status(404).json({ error: "Address not found" });
  }

  address.firstName = req.body.firstName || address.firstName;
  address.lastName = req.body.lastName || address.lastName;
  address.address = req.body.address || address.address;
  address.city = req.body.city || address.city;
  address.phoneNumber = req.body.phoneNumber || address.phoneNumber;
  address.zipcode = req.body.zipcode || address.zipcode;
  address.country = req.body.country || address.country;

  if (req.body.isPrimary) {
    // If the updated address is to be primary, unset previous primary address
    await Address.updateMany(
      { user: address.user, isPrimary: true },
      { isPrimary: false }
    );
    address.isPrimary = true;
    console.log("MAIN CHAL GAYA");
  }

  const updatedAddress = await address.save();
  res.json(updatedAddress);
});

// exports.deleteAddress = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const address = await Address.findById(id);

//   if (!address) {
//     return res.status(404).json({ error: "Address not found" });
//   }

//   await Address.findByIdAndDelete(id);
//   res.json({ message: "Address removed successfully" });
// });

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);

  if (!address) {
    return res.status(404).json({ error: "Address not found" });
  }

  const wasPrimary = address.isPrimary;

  await Address.findByIdAndDelete(id);

  if (wasPrimary) {
    // Find the next available address sorted by createdAt and set it as primary
    const nextAddress = await Address.findOne({ user: req.user._id }).sort({
      createdAt: 1,
    });

    if (nextAddress) {
      nextAddress.isPrimary = true;
      await nextAddress.save();
    }
  }

  res.json({ message: "Address removed successfully" });
});

exports.setPrimaryAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);

  if (!address) {
    return res.status(404).json({ error: "Address not found" });
  }

  // Set the current primary address to false
  await Address.updateMany(
    { user: req.user._id, isPrimary: true },
    { $set: { isPrimary: false } }
  );

  // Set the selected address as primary
  address.isPrimary = true;
  await address.save();

  res.json({ message: "Primary address set successfully" });
});
