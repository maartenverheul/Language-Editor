<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
    <b-container>
    <b-navbar-brand href="#">Language Editor</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search for translation"></b-form-input>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: 'Header'
}
</script>